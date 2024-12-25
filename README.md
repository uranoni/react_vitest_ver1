# React 註冊表單與測試範例

這個專案展示了如何使用 React 創建一個註冊表單，並使用 Vitest 進行單元測試。

## 專案設置

### 1. 初始化專案

使用 Vite 創建 React 專案：

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
```

### 2. 安裝必要套件

```bash
# 安裝測試相關套件
npm install -D @testing-library/react @testing-library/jest-dom jsdom vitest
npm install -D @vitest/coverage-v8 @vitejs/plugin-react

# 安裝 PropTypes 用於類型檢查
npm install prop-types
```

### 3. 建立專案結構

```plaintext
src/
   ├── components/
   │   ├── RegisterForm.jsx      # 註冊表單組件
   │   ├── RegisterForm.css      # 表單樣式
   │   └── __tests__/
   │       └── RegisterForm.test.jsx  # 測試文件
   ├── App.jsx
   ├── main.jsx
   ├── setupTests.js            # 測試設置文件
   └── ...
```

### 4. 創建組件文件

#### RegisterForm.jsx
```jsx
import { useState } from 'react'
import PropTypes from 'prop-types'

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthYear: '',
    isSingle: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      setFormData({
        name: '',
        birthYear: '',
        isSingle: false
      })
    } catch (error) {
      console.error('提交表單時發生錯誤:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-group">
        <label htmlFor="name">姓名：</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          data-testid="name-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="birthYear">出生年份：</label>
        <input
          type="number"
          id="birthYear"
          name="birthYear"
          value={formData.birthYear}
          onChange={handleChange}
          required
          data-testid="birthYear-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="isSingle">
          <input
            type="checkbox"
            id="isSingle"
            name="isSingle"
            checked={formData.isSingle}
            onChange={handleChange}
            data-testid="isSingle-checkbox"
          />
          是否單身
        </label>
      </div>

      <button type="submit" data-testid="submit-button">
        提交註冊
      </button>
    </form>
  )
}

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default RegisterForm
```

#### RegisterForm.css
```css
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #45a049;
}
```

#### RegisterForm.test.jsx
```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RegisterForm from '../RegisterForm'

describe('RegisterForm', () => {
  it('應該正確渲染所有表單元素', () => {
    render(<RegisterForm onSubmit={() => {}} />)
    
    expect(screen.getByLabelText(/姓名/)).toBeInTheDocument()
    expect(screen.getByLabelText(/出生年份/)).toBeInTheDocument()
    expect(screen.getByLabelText(/是否單身/)).toBeInTheDocument()
    expect(screen.getByText('提交註冊')).toBeInTheDocument()
  })

  it('應該能夠更新表單數據', () => {
    render(<RegisterForm onSubmit={() => {}} />)
    
    const nameInput = screen.getByTestId('name-input')
    const birthYearInput = screen.getByTestId('birthYear-input')
    const isSingleCheckbox = screen.getByTestId('isSingle-checkbox')

    fireEvent.change(nameInput, { target: { value: '張三' } })
    fireEvent.change(birthYearInput, { target: { value: '1990' } })
    fireEvent.click(isSingleCheckbox)

    expect(nameInput.value).toBe('張三')
    expect(birthYearInput.value).toBe('1990')
    expect(isSingleCheckbox.checked).toBe(true)
  })

  it('提交表單時應該調用 onSubmit', async () => {
    const mockOnSubmit = vi.fn()
    render(<RegisterForm onSubmit={mockOnSubmit} />)
    
    const nameInput = screen.getByTestId('name-input')
    const birthYearInput = screen.getByTestId('birthYear-input')
    const isSingleCheckbox = screen.getByTestId('isSingle-checkbox')
    const submitButton = screen.getByTestId('submit-button')

    fireEvent.change(nameInput, { target: { value: '張三' } })
    fireEvent.change(birthYearInput, { target: { value: '1990' } })
    fireEvent.click(isSingleCheckbox)
    fireEvent.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: '張三',
      birthYear: '1990',
      isSingle: true
    })
  })
})
```

### 5. 配置測試環境

#### vitest.config.js
```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
        'src/main.jsx',
        'src/App.jsx',
        'vitest.config.js',
        'vite.config.js',
        'eslint.config.js',
        '**/*.test.*',
        '**/__tests__/**'
      ],
      all: true,
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
})
```

#### setupTests.js
```javascript
import '@testing-library/jest-dom'
```

### 6. 修改 package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^14.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitest/coverage-v8": "^2.1.8",
    "jsdom": "^22.1.0",
    "vitest": "^2.1.8"
  }
}
```

## 常用指令

```bash
# 啟動開發服務器
npm run dev

# 運行測試
npm test

# 生成測試覆蓋率報告
npm run coverage

# 建構專案
npm run build
```

## 使用的套件說明

### 開發依賴
- `@testing-library/react`: React 組件測試工具
- `@testing-library/jest-dom`: DOM 斷言擴展
- `jsdom`: 瀏覽器環境模擬
- `vitest`: 測試框架
- `@vitest/coverage-v8`: 測試覆蓋率工具
- `@vitejs/plugin-react`: Vite 的 React 插件

### 生產依賴
- `react`: React 核心庫
- `react-dom`: React DOM 操作
- `prop-types`: React 屬性類型檢查

## 注意事項

1. 環境要求
   - Node.js 16+ 
   - npm 7+

2. 開發建議
   - 提交前運行完整測試套件
   - 確保測試覆蓋率達標
   - 保持代碼風格一致

3. 測試相關
   - 使用 data-testid 進行元素選擇
   - 模擬真實用戶操作
   - 注意非同步測試處理