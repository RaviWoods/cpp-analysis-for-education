#include <stdio.h>

int f(int x) {
    f(1);
    return 0;
}

int main() {
    f(1);
}
