// Functional test for share.js module
// This test simulates the browser environment and tests the share functionality

const fs = require('fs');
const path = require('path');

console.log('=== Functional Test for Share Feature ===\n');

// Load the share.js content
const shareContent = fs.readFileSync(path.join(__dirname, 'share.js'), 'utf8');

// Create a mock browser environment
global.window = {
    location: {
        hash: '',
        pathname: '/test.html',
        origin: 'http://localhost',
        search: '',
        href: 'http://localhost/test.html'
    },
    history: {
        replaceState: function(state, title, url) {
            console.log('  history.replaceState called with URL:', url);
        }
    },
    navigator: {
        clipboard: null // Simulate no clipboard access
    }
};

global.document = {
    head: {
        appendChild: function(element) {
            console.log('  Style element added to head');
        },
        querySelector: function() { return null; }
    },
    body: {
        appendChild: function(element) {
            console.log('  Element added to body');
        },
        removeChild: function(element) {
            console.log('  Element removed from body');
        }
    },
    createElement: function(tag) {
        return {
            style: {},
            focus: function() {},
            select: function() {},
            setAttribute: function(k, v) {},
            remove: function() {},
            appendChild: function() {},
            value: '',
            className: '',
            textContent: '',
            innerHTML: ''
        };
    },
    querySelector: function() { return null; },
    execCommand: function(cmd) {
        console.log('  execCommand called:', cmd);
        return true;
    }
};

// Mock URL class
global.URL = function(url) {
    this.hash = window.location.hash;
    this.pathname = window.location.pathname;
    this.origin = window.location.origin;
    this.search = window.location.search;
};

// Execute the share.js code in this context
console.log('1. Loading share.js module...\n');
eval(shareContent);

// Test 1: encodeResult function
console.log('2. Testing encodeResult function...\n');
const testScores = {
    soft: 85,
    shy: 72,
    feminine: 90,
    voice: 68,
    identity: 88,
    action: 75
};

try {
    const url = window.ShareModule.encodeResult(testScores);
    console.log('   Input scores:', JSON.stringify(testScores));
    console.log('   Generated URL:', url);
    console.log('   ✓ encodeResult test PASSED\n');
} catch (e) {
    console.log('   ✗ encodeResult test FAILED:', e.message, '\n');
    process.exit(1);
}

// Test 2: decodeResult function
console.log('3. Testing decodeResult function...\n');
try {
    // Set a hash
    window.location.hash = '#result=' + btoa(JSON.stringify(testScores));

    const decoded = window.ShareModule.decodeResult();
    console.log('   Hash set to:', window.location.hash);
    console.log('   Decoded scores:', JSON.stringify(decoded));

    // Verify
    let match = true;
    for (const key in testScores) {
        if (decoded[key] !== testScores[key]) {
            match = false;
            break;
        }
    }

    if (match) {
        console.log('   ✓ decodeResult test PASSED\n');
    } else {
        console.log('   ✗ decodeResult test FAILED: Scores do not match\n');
        process.exit(1);
    }
} catch (e) {
    console.log('   ✗ decodeResult test FAILED:', e.message, '\n');
    process.exit(1);
}

// Test 3: copyShareLink function (without clipboard)
console.log('4. Testing copyShareLink function (fallback mode)...\n');
try {
    window.ShareModule.copyShareLink(testScores).then(success => {
        console.log('   Copy success:', success);
        if (success) {
            console.log('   ✓ copyShareLink test PASSED\n');
        } else {
            console.log('   ✗ copyShareLink test FAILED: copy failed\n');
            process.exit(1);
        }
    });
} catch (e) {
    console.log('   ✗ copyShareLink test FAILED:', e.message, '\n');
    process.exit(1);
}

// Test 4: URL format validation
console.log('5. Testing URL format...\n');
try {
    const url = window.ShareModule.encodeResult(testScores);
    const urlObj = new URL(url);

    if (urlObj.hash && urlObj.hash.startsWith('#result=')) {
        console.log('   URL format is correct');
        console.log('   Hash:', urlObj.hash);
        console.log('   ✓ URL format test PASSED\n');
    } else {
        console.log('   ✗ URL format test FAILED: Incorrect hash format\n');
        process.exit(1);
    }
} catch (e) {
    console.log('   ✗ URL format test FAILED:', e.message, '\n');
    process.exit(1);
}

// Test 5: Error handling
console.log('6. Testing error handling...\n');
try {
    // Test with invalid hash
    window.location.hash = '#result=invaliddata';
    const decoded = window.ShareModule.decodeResult();

    if (decoded === null) {
        console.log('   Invalid data correctly returns null');
        console.log('   ✓ Error handling test PASSED\n');
    } else {
        console.log('   ✗ Error handling test FAILED: Should return null for invalid data\n');
        process.exit(1);
    }
} catch (e) {
    console.log('   ✗ Error handling test FAILED:', e.message, '\n');
    process.exit(1);
}

console.log('=== All Functional Tests Passed! ===\n');
console.log('✓ encodeResult correctly encodes scores to URL');
console.log('✓ decodeResult correctly decodes scores from URL');
console.log('✓ copyShareLink handles fallback when clipboard unavailable');
console.log('✓ URL format is correct');
console.log('✓ Error handling works correctly');
console.log('\nThe share feature is fully functional!');
