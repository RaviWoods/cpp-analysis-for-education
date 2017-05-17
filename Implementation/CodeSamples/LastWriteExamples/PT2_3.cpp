void f(int& in) {
	in = 10;
	return;
}

int main () {
	int x = 11;
	f(x);
	return 0;
}