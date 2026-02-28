const fs = require('fs');
const babel = require('@babel/core');

const files = [
    'src/screens/OasisShowcaseScreen.tsx',
    'src/components/Oasis/OasisCard.tsx',
    'src/components/Oasis/OasisButton.tsx',
    'src/components/Oasis/OasisInput.tsx',
    'src/components/Oasis/OasisToggle.tsx',
    'src/components/Oasis/OasisSkeleton.tsx',
    'src/components/Oasis/OasisMeter.tsx',
    'src/components/Oasis/OasisChart.tsx',
    'src/components/Oasis/OasisTree.tsx',
    'src/components/Oasis/OasisScreen.tsx',
];

try {
    const presetTs = require('@babel/preset-typescript');
    const presetReact = require('@babel/preset-react');

    files.forEach(f => {
        const code = fs.readFileSync(f, 'utf8');
        babel.transformSync(code, {
            filename: f,
            presets: [presetTs, presetReact],
            plugins: [
                function ({ types: t }) {
                    return {
                        visitor: {
                            JSXText(path) {
                                const val = path.node.value;
                                if (val.trim() === '') return;

                                let parent = path.parentPath;
                                let isWrappedText = false;
                                while (parent) {
                                    if (parent.isJSXElement()) {
                                        const name = parent.node.openingElement.name;
                                        // Could be an identifier or member expression
                                        let tagName = '';
                                        if (name.type === 'JSXIdentifier') tagName = name.name;
                                        if (name.type === 'JSXMemberExpression') tagName = name.object.name + '.' + name.property.name;

                                        if (tagName === 'Text' || tagName === 'Animated.Text' || tagName === 'AnimatedText') {
                                            isWrappedText = true;
                                            break;
                                        }
                                    }
                                    parent = parent.parentPath;
                                }
                                if (!isWrappedText) {
                                    console.log('FOUND RAW TEXT IN FILE:', f);
                                    console.log('TEXT:', JSON.stringify(val));
                                    console.log('LINE:', path.node.loc.start.line);
                                }
                            }
                        }
                    };
                }
            ]
        });
    });
    console.log("Analysis complete.");
} catch (e) {
    console.error("Babel parsing failed", e);
}
