#include <stdio.h>

bool g() {
    if (1==0) {
        return true;
    } else {
        return g();
    }
}

int main() {
    g();
}
