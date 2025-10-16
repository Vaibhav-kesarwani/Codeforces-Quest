// public/assets/scripts/extractTestcases/extractTestcases.js

if (typeof isFirefox === 'undefined') {
    let isFirefox = typeof browser !== 'undefined';
    let browserAPI = isFirefox ? browser : chrome;
}

/**
 * Extract test cases from Codeforces problem page with error handling
 */
const extractTestCases = async (tab) => {
    try {
        // Validate tab URL
        const match = tab.url.match(/\/problemset\/problem\/([0-9]+)\/([^\/]+)|\/contest\/([0-9]+)\/problem\/([^\/]+)|\/gym\/([0-9]+)\/problem\/([^\/]+)/);
        
        if (!match) {
            console.log('Not a valid Codeforces problem page');
            return;
        }

        // Execute script with timeout
        const scriptPromise = browserAPI.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                try {
                    const sampleTests = document.querySelectorAll(".sample-test");
                    
                    if (sampleTests.length === 0) {
                        return { 
                            error: 'No test cases found on this page',
                            testCases: [] 
                        };
                    }

                    const testCases = [];
                    let caseNumber = 1;

                    sampleTests.forEach((sampleTestDiv) => {
                        try {
                            const inputs = sampleTestDiv.querySelectorAll(".input pre");
                            const outputs = sampleTestDiv.querySelectorAll(".output pre");

                            if (inputs.length === 0 || outputs.length === 0) {
                                console.warn('Skipping sample test: missing input or output elements');
                                return;
                            }

                            if (inputs.length !== outputs.length) {
                                console.warn('Input/output count mismatch');
                                return;
                            }

                            inputs.forEach((inputElement, index) => {
                                try {
                                    const inputValue = inputElement.innerText.trim();
                                    const outputValue = outputs[index].innerText.trim();
                                    
                                    testCases.push({
                                        Testcase: caseNumber++,
                                        Input: inputValue,
                                        ExpectedOutput: outputValue,
                                        Output: "",
                                    });
                                } catch (err) {
                                    console.error('Error processing test case:', err);
                                }
                            });
                        } catch (err) {
                            console.error('Error processing sample test div:', err);
                        }
                    });

                    return { testCases };
                } catch (error) {
                    return { 
                        error: 'Failed to extract test cases: ' + error.message,
                        testCases: [] 
                    };
                }
            },
        });

        // Add timeout to script execution
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Script execution timeout')), 10000)
        );

        const [result] = await Promise.race([scriptPromise, timeoutPromise]);

        if (!result || !result.result) {
            console.error('No result from script execution');
            sendErrorMessage('Failed to extract test cases from the page');
            return;
        }

        const { testCases, error } = result.result;

        if (error) {
            console.error('Test case extraction error:', error);
            sendErrorMessage(error);
            return;
        }

        if (!testCases || testCases.length === 0) {
            console.warn('No test cases found');
            sendErrorMessage('No test cases found on this problem page');
            return;
        }

        // Send test cases to extension
        browserAPI.runtime.sendMessage({ testCase: testCases }).catch(err => {
            console.error("Error sending test cases to extension:", err);
        });

    } catch (error) {
        console.error("Fatal error extracting test cases:", error);
        
        // Determine error type
        let errorMessage = 'Failed to extract test cases';
        
        if (error.message.includes('timeout')) {
            errorMessage = 'Request timed out. Please refresh and try again.';
        } else if (error.message.includes('Cannot access')) {
            errorMessage = 'Cannot access this page. Please check permissions.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        sendErrorMessage(errorMessage);
    }
};

/**
 * Send error message to extension
 */
const sendErrorMessage = (errorMessage) => {
    try {
        browserAPI.runtime.sendMessage({ 
            testCaseError: errorMessage,
            testCase: [] 
        }).catch(err => {
            console.error("Failed to send error message:", err);
        });
    } catch (err) {
        console.error("Error in sendErrorMessage:", err);
    }
};

/**
 * Message listener with error handling
 */
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.requestTestCases) {
        try {
            browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (!tabs || tabs.length === 0) {
                    console.error('No active tab found');
                    sendResponse({ 
                        status: "error", 
                        message: "No active tab found" 
                    });
                    return;
                }

                const activeTab = tabs[0];
                
                if (!activeTab.url || !activeTab.url.includes('codeforces.com')) {
                    console.log('Not on a Codeforces page');
                    sendResponse({ 
                        status: "error", 
                        message: "Not on a Codeforces problem page" 
                    });
                    return;
                }

                extractTestCases(activeTab)
                    .then(() => {
                        sendResponse({ status: "extracting" });
                    })
                    .catch(err => {
                        console.error('Extract test cases failed:', err);
                        sendResponse({ 
                            status: "error", 
                            message: err.message 
                        });
                    });
            });
            
            return true; // Keep message channel open for async response
        } catch (error) {
            console.error('Message listener error:', error);
            sendResponse({ 
                status: "error", 
                message: "Failed to process request" 
            });
            return false;
        }
    }
});

// Global error handler for unhandled rejections
if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
    });
}