import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State quản lý dữ liệu form (Thêm & Sửa)
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  })

  // State để biết đang ở chế độ Sửa (lưu trữ studentId hoặc _id đang sửa) hay Thêm mới
  const [editingId, setEditingId] = useState(null)

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

  // Xử lý gửi form (Thêm mới hoặc Cập nhật)
  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      // Gọi API Cập nhật (PUT) - Câu 61
      fetch(`/api/students/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Cập nhật sinh viên thất bại!')
          return res.json()
        })
        .then((updatedStudent) => {
          setStudents(students.map((s) => (s.studentId === editingId || s._id === editingId ? updatedStudent : s)))
          setFormData({ studentId: '', name: '', email: '' })
          setEditingId(null)
        })
        .catch((err) => alert(err.message))
    } else {
      // Gọi API Thêm mới (POST) - Câu 60
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
          setFormData({ studentId: '', name: '', email: '' })
        })
        .catch((err) => alert(err.message))
    }
  }

  // Đưa dữ liệu sinh viên lên form để sửa
  const handleEdit = (student) => {
    setEditingId(student.studentId || student._id)
    setFormData({
      studentId: student.studentId || '',
      name: student.name || '',
      email: student.email || ''
    })
  }

  // Xử lý Xóa sinh viên (DELETE) - Câu 62
  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) return

    fetch(`/api/students/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Xóa sinh viên thất bại!')
        return res.json()
      })
      .then(() => {
        setStudents(students.filter((s) => s.studentId !== id && s._id !== id))
      })
      .catch((err) => alert(err.message))
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Quản Lý Sinh Viên (MERN Stack)</h1>

      {/* Form nhập liệu (Thêm / Sửa) */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', color: '#333' }}>
        <h3>{editingId ? 'Cập Nhật Thông Tin Sinh Viên' : 'Thêm Sinh Viên Mới'}</h3>
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
              disabled={editingId ? true : false} // Khóa mã sinh viên khi đang sửa nếu dùng studentId làm khóa
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: editingId ? '#ff9800' : '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {editingId ? 'Cập Nhật' : 'Lưu Sinh Viên'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setFormData({ studentId: '', name: '', email: '' }); }}
                style={{ padding: '10px 20px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Hủy
              </button>
            )}
          </div>
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
              <th>Thao tác</th>
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
                  <td style={{ textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button 
                      onClick={() => handleEdit(student)}
                      style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(student.studentId || student._id)}
                      style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Chưa có dữ liệu sinh viên nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App