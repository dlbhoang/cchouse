# PropAddEdit Component

Đây là component form thêm/chỉnh sửa bất động sản được thiết kế theo Figma Design System (C.C.House).

## 📁 Cấu trúc File

```
project/
├── index.tsx                  # React component chính
├── PropAddEdit.module.css     # CSS module cho component
├── globals.css                # Global styles (cập nhật với font Inter)
└── README.md                  # File này
```

## ✨ Tính Năng

✅ **Font Inter** - Sử dụng font google Inter cho toàn bộ ứng dụng
✅ **Ant Design Integration** - Tích hợp mượt mà với Ant Design components
✅ **Responsive Design** - Hoạt động tốt trên mobile, tablet, desktop
✅ **Figma Design System** - Đúng theo design từ Figma
✅ **Dark Mode Support** - Hỗ trợ chế độ tối

## 🎨 Màu Sắc Chính

```
Primary Color (Orange):  #fa8c16
Primary Dark:            #d46b08
Border:                  #e8e8e8
Background:              #f5f5f5
Text Secondary:          #595959
```

## 📋 Form Sections

### 1. **Thông Tin Cơ Bản**
- Tiêu Đề
- Loại Giao Dịch (Bán/Cho Thuê)
- Mô Tả

### 2. **Chi Tiết Bất Động Sản**
- Giá (với formatter tiền tệ)
- Diện Tích (m²)
- Số Phòng Ngủ
- Số Phòng Tắm
- Loại Bất Động Sản
- Trạng Thái

### 3. **Địa Chỉ**
- Địa Chỉ Chi Tiết
- Thành Phố
- Quận/Huyện
- Phường/Xã

### 4. **Hình Ảnh**
- Drag & Drop Upload
- Checkbox Nổi Bật

## 🚀 Cách Sử Dụng

### 1. **Import Component**

```tsx
import PropAddEdit from '@/pages/PropAddEdit';

export default function App() {
  return <PropAddEdit />;
}
```

### 2. **CSS Import**

Đảm bảo import `globals.css` trong layout chính hoặc `_app.tsx`:

```tsx
import '@/styles/globals.css';
```

### 3. **Import Ant Design Styles**

```tsx
import 'antd/dist/reset.css';
```

## 📦 Dependencies

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "antd": "^5.0.0",
  "@ant-design/icons": "^5.0.0"
}
```

## 🎯 Props & Customization

Component hiện tại không nhận props. Để tùy chỉnh:

### Thay đổi màu primary

Sửa trong `PropAddEdit.module.css`:

```css
--primary-color: #fa8c16; /* Thay màu tại đây */
```

Và cập nhật tất cả các references:
- `.myCard` hover shadow
- Input focus border
- Radio button checked
- Checkbox checked

### Thay đổi font

Font mặc định là **Inter**. Để đổi:

1. Cập nhật trong `globals.css`:
```css
--font-inter: 'YourFont', sans-serif;
```

2. Import font nếu cần:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;500;600;700');
```

## 🔧 Tailwind CSS Integration

Nếu sử dụng Tailwind CSS, component sẽ hoạt động với:

```tsx
import 'tailwindcss/tailwind.css';
```

## 📱 Responsive Breakpoints

- **Mobile**: < 600px - Ẩn contact section, QR code
- **Tablet**: 600px - 992px - Hiển thị tablet layout
- **Desktop**: > 992px - Full layout

## ⌨️ Keyboard Navigation

- `Tab` - Di chuyển giữa form fields
- `Shift + Tab` - Di chuyển ngược lại
- `Enter` - Submit form (khi focus ở button)
- `Space` - Toggle checkbox/radio

## 🎨 CSS Architecture

```
PropAddEdit.module.css
├── Page wrapper styling
├── Card styling (hover, shadow, border-radius)
├── Form labels (uppercase, font-weight)
├── Input components (focus states, colors)
├── Radio & Checkbox overrides
├── Upload area styling
└── Sticky bottom bar
```

## 🔍 Form Validation

Form hiện tại có validation cơ bản. Để thêm rule:

```tsx
<Form.Item
  label="Tiêu Đề"
  name="title"
  rules={[
    { required: true, message: 'Vui lòng nhập tiêu đề' },
    { min: 3, message: 'Tối thiểu 3 ký tự' },
    { max: 100, message: 'Tối đa 100 ký tự' },
    // Thêm rule khác tại đây
  ]}
>
  <Input />
</Form.Item>
```

## 💾 Form Submission

Hiện tại `onFinish` chỉ log giá trị. Để thêm API call:

```tsx
const onFinish = async (values: PropertyData) => {
  try {
    const response = await fetch('/api/properties', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    // Handle response
  } catch (error) {
    // Handle error
  }
};
```

## 🐛 Troubleshooting

### Font Inter không hiển thị
- Kiểm tra `globals.css` import Google Fonts
- Clear browser cache
- Kiểm tra network tab trong DevTools

### Ant Design styles conflict
- Đảm bảo `antd/dist/reset.css` được import trước custom CSS
- Sử dụng `!important` nếu cần override

### Form không submit
- Kiểm tra tất cả required fields có giá trị
- Kiểm tra console cho validation errors
- Verifying form validation rules

## 📚 Resources

- [Ant Design Documentation](https://ant.design/)
- [React Documentation](https://react.dev/)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [CSS Modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)

## 📝 License

MIT

---

**Last Updated**: 2024
**Author**: Design System Team
**Component Version**: 1.0.0
