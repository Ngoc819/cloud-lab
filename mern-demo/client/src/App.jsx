import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State quản lý dữ liệu form (Câu 48)
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  })

  // Hàm gọi API lấy danh sách sinh viên
  const fetchStudents = () => {
    fetch('/api/students')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải dữ liệu từ server!')
        return res.json()
      })
      .then((data) => {
        setStudents(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Xử lý khi người dùng gõ vào các ô input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Xử lý gửi form thêm sinh viên (chuẩn bị luôn cho tính năng lưu vào database)
  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Thêm sinh viên thất bại!')
        return res.json()
      })
      .then((newStudent) => {
        setStudents([...students, newStudent])
        // Reset form sau khi thêm thành công
        setFormData({ studentId: '', name: '', email: '' })
      })
      .catch((err) => alert(err.message))
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Quản Lý Sinh Viên (MERN Stack)</h1>

      {/* Form nhập MSSV, Họ tên và Email (Câu 48) */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', color: '#333' }}>
        <h3>Thêm Sinh Viên Mới</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mã sinh viên (MSSV):</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Nhập mã sinh viên..."
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Họ và Tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên..."
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email..."
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Lưu Sinh Viên
          </button>
        </form>
      </div>

      <h2>Danh Sách Sinh Viên</h2>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
      
      {!loading && !error && (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', backgroundColor: '#fff', color: '#333' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>STT</th>
              <th>Họ và Tên</th>
              <th>Mã sinh viên</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student._id || index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.studentId || student.mssv}</td>
                  <td>{student.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có dữ liệu sinh viên nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App