// Определение типа треугольника

#include "stdafx.h"
#include <clocale>
#include <iostream>
#include <string>

using namespace std;

bool IsTriangle(int a, int b, int c)
{
	return ((a + b > c) && (a + c > b) && (b + c > a));
}

bool IsIsosceles(int a, int b, int c)
{
	return ((a == b) || (a == c) || (b == c));
}

bool IsEquilateral(int a, int b, int c)
{
	return (a == b && b == c);
}

bool IsArgsNumberCorrect(int argc)
{
	return (argc == 4);
}

int StringToInt(const char* str, bool& err)
{
	char* pLastChar = NULL;
	int intFromStr = strtol(str, &pLastChar, 10);
	err = ((*str == '\0') || (*pLastChar != '\0'));
	if (errno == ERANGE)
	{
		cout << "неверный пользовательский ввод" << endl;
		errno = 0;
		return 0;
	}

	return intFromStr;
}

int main(int argc, char* argv[])
{
	setlocale(LC_ALL, "Russian");

	int a;
	int b;
	int c;
	bool err1;
	bool err2;
	bool err3;
	string message;

	if (!IsArgsNumberCorrect(argc))
	{
		cout << "неверное количество параметров" << endl;
		return 1;
	}

	a = StringToInt(argv[1], err1);
	b = StringToInt(argv[2], err2);
	c = StringToInt(argv[3], err3);

	if (err1 || err2 || err3)
	{
		cout << "неверный пользовательский ввод" << endl;
		return 1;
	}

	message = "не треугольник";

	if (IsTriangle(a, b, c))
	{
		message = IsEquilateral(a, b, c) ? ("равносторонний") : (IsIsosceles(a, b, c) ? ("равнобедренный") : ("обычный"));
	}

	cout << message << endl;

	return 0;
}
