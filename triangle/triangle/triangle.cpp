// Определение типа треугольника

#include "stdafx.h"
#include <clocale>
#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

bool IsTriangle(double a, double b, double c)
{
	return ((a + b > c) && (a + c > b) && (b + c > a));
}

bool IsIsosceles(double a, double b, double c)
{
	return ((a == b) || (a == c) || (b == c));
}

bool IsEquilateral(double a, double b, double c)
{
	return (a == b && b == c);
}

bool IsArgsNumberCorrect(double argc)
{
	return (argc == 4);
}

double StringToDouble(const char* str, bool & err)
{
	char* pLastChar = NULL;
	try
	{
		string str_1 = str;
		std::replace(str_1.begin(), str_1.end(), '.', ','); 
		double doubleFromStr = stod(str_1);
		return doubleFromStr;
	}
	catch (const invalid_argument & e)
	{
		cout << "неверный пользовательский ввод" << endl;
		err = true;
		return 0;
	}
}

int main(int argc, char* argv[])
{
	setlocale(LC_ALL, "Russian");

	double a;
	double b;
	double c;
	bool err1 = false;
	bool err2 = false;
	bool err3 = false;
	string message;

	if (!IsArgsNumberCorrect(argc))
	{
		cout << "неверное количество параметров" << endl;
		return 1;
	}

	a = StringToDouble(argv[1], err1);
	b = StringToDouble(argv[2], err2);
	c = StringToDouble(argv[3], err3);

	if (err1 || err2 || err3)
	{
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
