declare module 'react-katex' {
    import React from 'react';
    export interface LatexProps {
        children?: string;
        displayMode?: boolean;
        className?: string;
    }
    const Latex: React.FC<LatexProps>;
    export default Latex;
}
