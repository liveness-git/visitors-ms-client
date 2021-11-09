import { fireEvent, render } from '@testing-library/react';
import { Login } from './Login';
import '../i18n';

let container: HTMLElement;
beforeEach(() => {
  const component = render(<Login />);
  container = component.container;
});

test('test', () => {
  const email = container.querySelector('#email') as HTMLInputElement;
  expect(email).toBeInTheDocument(); // elementが存在しているか否か
});

test('test2', () => {
  const email = container.querySelector('#email') as HTMLInputElement;
  fireEvent.change(email, { target: { value: 'test@email.com' } });
  expect(email.value).toBe('test@email.com'); // 予想した値が入っているか否か
  expect(email.value).not.toBe(''); // ブランクではない。となっているか
});

// test('test3', () => {
//   const button = container.querySelector('button') as HTMLButtonElement;
//   fireEvent.click(button);
//   const error = container.querySelector('#email-helper-text') as HTMLParagraphElement;
//   expect(error).toBeInTheDocument();
//   // expect(error.innerText).toBe(t('login.form.required') as string);
// });

// test('test4', () => {
//   const button = container.querySelector('button') as HTMLButtonElement;
//   const email = container.querySelector('#email') as HTMLInputElement;
//   fireEvent.change(email, { target: { value: 'test' } });
//   fireEvent.click(button);
//   const error = container.querySelector('#email-helper-text') as HTMLParagraphElement;
//   expect(error).toBeInTheDocument();
//   // expect(error.innerText).toBe(t('無効なパターンです。') as string);
// });
