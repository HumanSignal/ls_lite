import React from 'react';

export default 'SvgMock';

const SvgMock = React.forwardRef((props, ref) => <svg ref={ref} {...props} />);

export const ReactComponent = SvgMock;
