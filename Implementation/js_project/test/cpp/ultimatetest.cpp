#include <iostream.h>
//Test comment
using namespace std;

int main() {
    /* Test 
    Multiline
    Comment */
    cout << "Hello World!" << endl;
    int a;
    int aaa; int bbb; int ccc;
    double b;
    float c;
    char d;
    int mediumLengthVariableName;
    float* foo1;
    double** foo2;
    int foo3[] = {1,2,3,4,5};
    int aA[1];
    int bA[2];
    int cA[3];
    int dA[4];
    int eA[5]; 
    int foo4[10000];
    return 0;
}

char foo5(int x1);
char foo6(int x2, float x3);
int foo7();
void foo8(int x4);
char foo9(int, float);
int foo10(void);
void foo11();
int *foo14();
int *foo15(int x7, float x8);
void foo16(int x9[10]);
void foo17(int x10[]);
int *foo18(int x11, float x12);

char *foo19[10];
char (*foo22)[10];

int (*foo12)();
int (*foo13)(int x5, float x6);
int (*foo20)[10];
char *(*foo21)(int, float *);