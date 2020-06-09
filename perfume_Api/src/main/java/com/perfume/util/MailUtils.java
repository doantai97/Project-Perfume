package com.perfume.util;

import com.perfume.constant.CheckoutStatus;
import com.perfume.constant.Const;
import com.perfume.entity.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.List;


@Component
public class MailUtils {

    @Value("${mail.username}")
    private String APP_EMAIL;

    @Value("${mail.password}")
    private String APP_PASSWORD;

    @Value("${mail.file-content}")
    private String fileNameContent;

    private Properties mailServerProperties;
    private Session getMailSession;
    private MimeMessage mailMessage;

    private String content;

    public MailUtils() {
        mailServerProperties = System.getProperties();
        mailServerProperties.put("mail.smtp.port", "587");
        mailServerProperties.put("mail.smtp.auth", "true");
        mailServerProperties.put("mail.smtp.starttls.enable", "true");
    }

    private String contentFile() {
        try {
            InputStream inputStream = new ClassPathResource(fileNameContent).getInputStream();
            byte[] bdata = FileCopyUtils.copyToByteArray(inputStream);
            String data = new String(bdata, StandardCharsets.UTF_8);
            return data;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "không có mail mẫu ";
    }

    private String setData(Checkout checkout) {
        Map<String, String> map = new HashMap<>();
        String status = CheckoutStatus.getCheckoutStatus(checkout.getStatus()).toString();
        map.put("id", checkout.getId().toString());
        map.put("status", status);

        String note = checkout.getNote();
        map.put("note", note != null ? note : "Không có");

        map.put("createdAt", Const.getSimpleDateFormat().format(checkout.getCreatedAt()));
        String listCheckoutItem = "";

        List<CheckoutItem> checkoutItemList = checkout.getCheckoutItems();
        for (CheckoutItem checkoutItem : checkoutItemList) {
            listCheckoutItem += "<tr>\n" +
                    "<td>" +
                    getNameVersion(checkoutItem.getVersion()) +
                    "VNĐ</td>\n" +
                    "<td>" + checkoutItem.getQuantity() + "</td>\n" +
                    "<td>" + checkoutItem.getVersion().getPrice() + " VNĐ</td>\n" +
                    "</tr>";
        }
        map.put("checkoutItem", listCheckoutItem);
        map.put("total", checkout.getTotal());

        String paymentMethod = checkout.getPaymentMethod() == 0 ? "Thanh toán khi nhận hàng" : "Thanh toán paypal";
        map.put("paymentMethod", paymentMethod);

        Coupon coupon = checkout.getCoupon();
        String coupomStr = "";
        if (coupon != null) {
            coupomStr = coupon.getPercent() + "%";
        } else {
            coupomStr = "Không có";
        }
        map.put("coupon", coupomStr);

        map.put("finalPrice", checkout.getFinalprice());

        map.put("name", checkout.getFirstname() + " " + checkout.getLastname());
        map.put("address", checkout.getAddress());
        map.put("phone", checkout.getPhone());
        map.put("mail", checkout.getEmail());

        String rs = StringUtils.format(content, map);
        return rs;
    }

    private String getNameVersion(Version version) {
        return version.getProduct().getName() + " phiên bản " + version.getName();
    }

    public void send(Checkout checkout) {
        Thread thread = new Thread(() -> {
            try {
                this.sendHtml(checkout);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        });
        thread.start();
    }

    public void sendTokenResetPassword(String email, String token) {
        Thread thread = new Thread(() -> {
            try {
                this.runSendTokenResetPassword(email, token);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        });
        thread.start();
    }

    private void runSendTokenResetPassword(String email, String token) throws MessagingException {
        getMailSession = Session.getDefaultInstance(mailServerProperties, null);
        mailMessage = new MimeMessage(getMailSession);

        mailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(email));


        mailMessage.setSubject("Lấy lại mật khẩu - Perfume", "utf-8");

        String content = "<a href='http://localhost:4200/confirm-account?token=" + token + "'>http://localhost:4200/confirm-account?token=" + token + "</a>";

        mailMessage.setFrom(new InternetAddress(APP_EMAIL));
        mailMessage.setContent(content, "text/html; charset=utf-8");

        Transport transport = getMailSession.getTransport("smtp");

        transport.connect("smtp.gmail.com", APP_EMAIL, APP_PASSWORD);
        transport.sendMessage(mailMessage, mailMessage.getAllRecipients());
        transport.close();
    }

    private void sendHtml(Checkout checkout) throws AddressException, MessagingException {
        if (this.content == null) {
            this.content = this.contentFile();
        }

        getMailSession = Session.getDefaultInstance(mailServerProperties, null);
        mailMessage = new MimeMessage(getMailSession);

        mailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(checkout.getEmail()));


        mailMessage.setSubject("Trạng thái đơn hàng - Perfume", "utf-8");
        
        mailMessage.setFrom(new InternetAddress(APP_EMAIL));

        String emailBody = setData(checkout);
        mailMessage.setContent(emailBody, "text/html; charset=utf-8");

        Transport transport = getMailSession.getTransport("smtp");

        transport.connect("smtp.gmail.com", APP_EMAIL, APP_PASSWORD);
        transport.sendMessage(mailMessage, mailMessage.getAllRecipients());
        transport.close();
    }

    public static void main(String[] args) {

    }


}
