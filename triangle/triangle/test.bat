set PROGRAM="%~1"
                                                                
REM неверное количество параметров
%PROGRAM% test\in1.txt output.txt                                 
IF NOT ERRORLEVEL 1 GOTO err 
FC output.txt test\out1.txt 
IF NOT ERRORLEVEL 1 GOTO err  

REM неверный пользовательский ввод  
%PROGRAM% test\in2.txt output.txt                                 
IF NOT ERRORLEVEL 1 GOTO err 
FC output.txt test\out2.txt 
IF NOT ERRORLEVEL 1 GOTO err  
           
REM равносторонний
triangle.exe test\in3.txt output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out3.txt 
IF ERRORLEVEL 1 GOTO err  
        
REM равнобедренный
%PROGRAM% test\in4.txt output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out4.txt 
IF ERRORLEVEL 1 GOTO err  

REM обычный
%PROGRAM% test\in5.txt output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out5.txt 
IF ERRORLEVEL 1 GOTO err                               
                            
REM не треугольник
%PROGRAM% test\in6.txt output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out6.txt 
IF ERRORLEVEL 1 GOTO err  
                     
ECHO Program testing succeeded :-)                  
EXIT                                                
:err                                                
ECHO Program testing failed :-(                     
EXIT