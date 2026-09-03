const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// 1. Thêm dòng này để import Model Student (câu 35)
const Student = require('../models/student');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware đọc JSON
app.use(express.json());

// Kết nối tới MongoDB Atlas sử dụng biến trong file .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// ==========================================
// CÂU 36: API GET /api/students
// ==========================================
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find(); // Lấy tất cả sinh viên từ Database
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// CÂU 37: API POST /api/students - Thêm sinh viên mới
// ==========================================
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body); // Tạo sinh viên mới từ dữ liệu req.body gửi lên
        res.status(201).json(newStudent); // Trả về kết quả kèm mã 201 (Created)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// CÂU 38: API PUT /api/students/:id - Cập nhật sinh viên theo studentId (MSSV)
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { studentId: req.params.id }, // Tìm theo trường studentId (VD: SV003)
            req.body,                    // Dữ liệu mới cần cập nhật
            { new: true }                // Trả về dữ liệu sau khi cập nhật
        );
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Không tìm thấy sinh viên' });
        }
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==========================================
// CÂU 39: API DELETE /api/students/:id - Xóa sinh viên theo studentId (MSSV)
// ==========================================
app.delete('/api/students/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ studentId: req.params.id });
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Không tìm thấy sinh viên' });
        }
        res.json({ message: 'Đã xóa sinh viên thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API test cũ
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Backend đang hoạt động' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});