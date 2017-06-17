int main() {
    void (*signal(int, void (*fp)(int)))(int);
    return 0;
}