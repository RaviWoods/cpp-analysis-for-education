#include <stdio.h>

bool g() {
    if (1==1) {
        return true;
    } else {
        return g();
    }
}

int main() {
    g();
}
