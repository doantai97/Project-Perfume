package com.perfume.util;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URLConnection;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@Component
public class UploadFileUtil {
    @Value("${file.upload-dir}")
    public String uploadFolder;

    @Autowired
    private Environment env;

    public String upload(String image, String fileName) {
        String base64Image = image;
        if (base64Image.contains(",")) {
            base64Image = base64Image.split(",")[1];
        }

        return saveFile(base64Image, fileName);
    }

    public UploadFileUtil() {
//        try {
//            uploadFolder = new File(".").getCanonicalPath() + env.getProperty("file.upload-dir");
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
    }

    public String getExtension(String base64Image) {
        byte[] decodedBytes = Base64.getDecoder().decode(base64Image);
        InputStream is = new ByteArrayInputStream(decodedBytes);
        String fileExtension = ".jpeg";
        try {
            String mimeType = URLConnection.guessContentTypeFromStream(is); //mimeType is something like "image/jpeg"
            String delimiter = "[/]";
            String[] tokens = mimeType.split(delimiter);
            fileExtension = "." + tokens[1];
        } catch (IOException e) {
            e.printStackTrace();
        }
        return fileExtension;
    }

    public String saveFile(String base64Image, String fileName) {
        byte[] decodedBytes = Base64.getDecoder().decode(base64Image);
        //Find out image type
        String fileExtension = getExtension(base64Image);

        fileName += fileExtension;
        String filePath = getFilePath(uploadFolder, fileName);
        File file = new File(uploadFolder);
        if (!file.exists()) {
            file.mkdirs();
        }
        try {
            FileUtils.writeByteArrayToFile(new File(filePath), decodedBytes);
            return fileName;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    public String getFilePath(String uploadFolder, String fileName) {
        return Paths.get(uploadFolder, fileName).toAbsolutePath().normalize().toString();
    }

    public Resource loadFileAsResource(String fileName) {
        String filePathAbsolute = getFilePath(uploadFolder, fileName);
        Path fileStorageLocation = Paths.get(uploadFolder)
                .toAbsolutePath().normalize();
        try {
            Path filePath = fileStorageLocation.resolve(filePathAbsolute).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                System.out.println("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            System.out.println("File not found " + fileName);
        }
        return null;
    }
}
