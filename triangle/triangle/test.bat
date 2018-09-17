REM неверное количество параметров
triangle.exe 1 > output.txt                                
IF NOT ERRORLEVEL 1 GOTO err  
FC output.txt test\out1.txt 
IF ERRORLEVEL 1 GOTO err          
                          
REM неверный пользовательский ввод  
triangle.exe 2 3 ff > output.txt                                
IF NOT ERRORLEVEL 1 GOTO err  
FC output.txt test\out2.txt 
IF ERRORLEVEL 1 GOTO err                       

REM равносторонний
triangle.exe 1 1 1 > output.txt                               
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out3.txt 
IF ERRORLEVEL 1 GOTO err  

REM равнобедренный
triangle.exe 2 3 3 > output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out4.txt 
IF ERRORLEVEL 1 GOTO err  

REM обычный
triangle.exe 3 4 5 > output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out5.txt 
IF ERRORLEVEL 1 GOTO err                               
                            
REM не треугольник
triangle.exe 3 4 20 > output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out6.txt 
IF ERRORLEVEL 1 GOTO err  
                       
ECHO Program testing succeeded :-)                  
EXIT                                                
:err                                                
ECHO Program testing failed :-(                     
EXIT