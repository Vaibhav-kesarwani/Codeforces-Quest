// src/utils/services/submissionService.ts
import { isProduction } from "../../data/constants";
import { getProblemName } from "../dom/getProblemName";
import { getProblemUrl } from "../dom/getProblemUrl";
import { getUserId } from "../dom/getUserId";
import { usageDataHelper } from "../usageDataHelper";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { browserAPI } from "../browser/browserDetect";

interface SubmissionResult {
    success: boolean;
    error?: string;
}

/**
 * Handle code submission with comprehensive error handling
 */
export const handleSubmission = async (
    editor: monaco.editor.IStandaloneCodeEditor | null,
    setIsSubmitting: (isSubmitting: boolean) => void,
    language: string,
    testCases: any
): Promise<void> => {
    if (!editor) {
        alert("Wait for editor to load");
        return;
    }

    try {
        // Get problem details
        const problemUrl = await getProblemUrl();
        const problemName = await getProblemName();
        const userId = await getUserId();

        if (userId.includes("Unknown")) {
            alert("Please login to submit code");
            return;
        }

        setIsSubmitting(true);
        const editorValue = editor.getValue();

        if (!editorValue || editorValue.trim().length === 0) {
            alert("Cannot submit empty code");
            setIsSubmitting(false);
            return;
        }

        // Get active tab with error handling
        let tabs;
        try {
            tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
        } catch (error) {
            console.error('Failed to query tabs:', error);
            alert("Failed to access browser tab. Please try again.");
            setIsSubmitting(false);
            return;
        }

        if (!tabs || tabs.length === 0) {
            alert("No active tab found");
            setIsSubmitting(false);
            return;
        }

        const [tab] = tabs;

        if (!tab.id) {
            alert("Invalid tab ID");
            setIsSubmitting(false);
            return;
        }

        // Execute submission script with timeout
        const submissionPromise = new Promise<SubmissionResult>((resolve) => {
            browserAPI.scripting.executeScript({
                target: { tabId: tab.id! },
                func: function (codeToSubmit) {
                    return new Promise<SubmissionResult>((resolveInner) => {
                        try {
                            // Create file blob
                            const blob = new Blob([codeToSubmit], { type: 'text/plain' });
                            const file = new File([blob], 'solution.txt', { type: 'text/plain' });
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);

                            // Find file input element
                            const fileInput = document.querySelector(
                                'input[type="file"][name="sourceFile"]'
                            ) as HTMLInputElement;

                            if (!fileInput) {
                                resolveInner({
                                    success: false,
                                    error: "File input not found on the page. Please make sure you're on a Codeforces problem page."
                                });
                                return;
                            }

                            // Set file and trigger change event
                            fileInput.files = dataTransfer.files;
                            fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                            // Wait and submit
                            setTimeout(() => {
                                try {
                                    const submitButton = document.querySelector(
                                        '#sidebarSubmitButton'
                                    ) as HTMLInputElement;

                                    if (!submitButton) {
                                        resolveInner({
                                            success: false,
                                            error: "Submit button not found. Please ensure you're on a problem page."
                                        });
                                        return;
                                    }

                                    submitButton.click();
                                    resolveInner({ success: true });
                                } catch (error) {
                                    resolveInner({
                                        success: false,
                                        error: `Failed to click submit button: ${error}`
                                    });
                                }
                            }, 200);

                        } catch (error) {
                            resolveInner({
                                success: false,
                                error: `Submission error: ${error}`
                            });
                        }
                    });
                },
                args: [editorValue]
            }, (results) => {
                if (browserAPI.runtime.lastError) {
                    console.error('Script execution error:', browserAPI.runtime.lastError);
                    resolve({
                        success: false,
                        error: browserAPI.runtime.lastError.message || 'Script execution failed'
                    });
                    return;
                }

                if (!results || results.length === 0) {
                    resolve({
                        success: false,
                        error: 'No result from submission script'
                    });
                    return;
                }

                resolve(results[0].result as SubmissionResult);
            });
        });

        // Add timeout to submission
        const timeoutPromise = new Promise<SubmissionResult>((resolve) =>
            setTimeout(() => resolve({
                success: false,
                error: 'Submission timeout. Please try again.'
            }), 10000)
        );

        const result = await Promise.race([submissionPromise, timeoutPromise]);

        if (!result.success) {
            alert(result.error || "Submission failed. Please try again.");
            setIsSubmitting(false);
            return;
        }

        // Track usage data if in production
        if (isProduction) {
            try {
                await usageDataHelper(language, testCases, userId).handleUsageData(
                    editorValue,
                    problemUrl,
                    "SUBMIT",
                    problemName
                );
            } catch (error) {
                console.error('Failed to log usage data:', error);
                // Don't block submission on analytics failure
            }
        }

        setIsSubmitting(false);

    } catch (error: any) {
        console.error('Submission error:', error);
        
        let errorMessage = 'An unexpected error occurred during submission.';
        
        if (error.message) {
            if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Submission timed out. Please try again.';
            } else {
                errorMessage = error.message;
            }
        }
        
        alert(errorMessage);
        setIsSubmitting(false);
    }
};