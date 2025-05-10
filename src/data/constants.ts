export const STORAGE_LIMIT_BYTES = 7 * 1024 * 1024; // local storage limit in bytes, 7MB
export const SINGLE_CODE_LIMIT_BYTES = 0.5 * 1024 * 1024; // single code limit in bytes, 0.5MB
export const MAX_PROBLEM_IO_SIZE = 15; // max number problem IO size
export const MAX_TEST_CASES = 5; // max number of test cases
export const EXECUTE_CODE_LIMIT = 3 * 1000; // max number of minutes to execute code

export const accessRestrictionMessage = `/* 
'''
Code Editor Access:
    -> The code editor is only available while viewing 
          or solving a Codeforces problem. 
          Functionality is disabled on other pages.

    -> To unlock full features,
         please visit: https://codeforces.com 
         and open any problem.

    -> If you encounter any issues, feel free to report them here:
         https://github.com/Vaibhav-kesarwani/Codeforces-Quest/issues
'''
*/
`;

export const isProduction = false;