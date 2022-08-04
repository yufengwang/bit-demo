import React from 'react';
import { render } from '@testing-library/react';
import { BasicReactDemo } from './react-demo.composition';
it('should render with the correct text', () => {
  const {
    getByText
  } = render( /*#__PURE__*/React.createElement(BasicReactDemo, null));
  const rendered = getByText('hello world!');
  expect(rendered).toBeTruthy();
});

//# sourceMappingURL=react-demo.spec.js.map