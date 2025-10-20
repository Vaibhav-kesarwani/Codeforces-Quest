export const getDefaultTemplate = (language: string) => {
    if (language === 'cpp') return `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    // write your code here
    return 0;
}`;
    if (language === 'java') return `import java.util.*;
public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // write your code here
    }
}`;
    if (language === 'python') return `if __name__ == "__main__":
    # write your code here
    pass`;
    if (language === 'javascript') return `function main() {
    // write your code here
}
main();`;
    if (language === 'kotlin') return `fun main() {
    // write your code here
}`;
    if (language === 'go') return `package main
import "fmt"
func main() {
    // write your code here
}`;
    if (language === 'rust') return `fn main() {
    // write your code here
}`;
    if (language === 'ruby') return `#!/usr/bin/env ruby

def main
  # write your code here
end

main if __FILE__ == $0
`;
    return '';
};
