#include <stdio.h>
#include <iostream>

int main() {
    int foo[5] = { 16, 2, 77, 40, 12071 };
    int topindex = 4+1;
    for(int i = 0; i <= topindex; i++) {
        std::cout << foo[i] << std::endl;
    }
}
