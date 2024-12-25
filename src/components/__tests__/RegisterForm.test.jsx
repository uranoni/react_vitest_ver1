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