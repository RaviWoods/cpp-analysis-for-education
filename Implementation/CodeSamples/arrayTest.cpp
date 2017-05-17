#include <iostream>
using namespace std;

int main() {
    int a = 1;
    int b = 2;
    int c = 3;
    int (*arrayTest)[10];
    *arrayTest[0] = 1;
    int y = **arrayTest;
    cout << y << endl;
}