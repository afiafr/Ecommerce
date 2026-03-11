import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${uuid()}`;
        const extension = file.originalname.split(".").pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    }
});
const maxFileSize = 5 * 1024 * 1024; // 5MB
const limits = {
    fileSize: maxFileSize
};
const upload = multer({ storage, limits });

export default upload;
