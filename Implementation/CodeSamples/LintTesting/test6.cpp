#include <stdio.h>
#include <iostream>

int main() {
    int foo[5] = { 16, 2, 77, 40, 12071 };
    for(int i = 0; i <= (sizeof foo / sizeof * foo); i++) {
        std::cout << foo[i] << std::endl;
    }
}
