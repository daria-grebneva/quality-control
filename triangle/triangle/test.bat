REM ����୮� ������⢮ ��ࠬ��஢
triangle.exe 1 > output.txt                                
IF NOT ERRORLEVEL 1 GOTO err  
FC output.txt test\out1.txt 
IF ERRORLEVEL 1 GOTO err          
                          
REM ������ ���짮��⥫�᪨� ����  
triangle.exe 2 3 ff > output.txt                                
IF NOT ERRORLEVEL 1 GOTO err  
FC output.txt test\out2.txt 
IF ERRORLEVEL 1 GOTO err                       

REM ࠢ����஭���
triangle.exe 1 1 1 > output.txt                               
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out3.txt 
IF ERRORLEVEL 1 GOTO err  

REM ࠢ�����७��
triangle.exe 2 3 3 > output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out4.txt 
IF ERRORLEVEL 1 GOTO err  

REM �����
triangle.exe 3 4 5 > output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out5.txt 
IF ERRORLEVEL 1 GOTO err                               
                            
REM �� ��㣮�쭨�
triangle.exe 3 4 20 > output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out6.txt 
IF ERRORLEVEL 1 GOTO err  
                       
ECHO Program testing succeeded :-)                  
EXIT                                                
:err                                                
ECHO Program testing failed :-(                     
EXIT