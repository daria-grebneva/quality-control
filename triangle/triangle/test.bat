set PROGRAM="%~1"
                                                                
REM ����୮� ������⢮ ��ࠬ��஢
%PROGRAM% test\in1.txt output.txt                                 
IF NOT ERRORLEVEL 1 GOTO err 
FC output.txt test\out1.txt 
IF NOT ERRORLEVEL 1 GOTO err  

REM ������ ���짮��⥫�᪨� ����  
%PROGRAM% test\in2.txt output.txt                                 
IF NOT ERRORLEVEL 1 GOTO err 
FC output.txt test\out2.txt 
IF NOT ERRORLEVEL 1 GOTO err  
           
REM ࠢ����஭���
triangle.exe test\in3.txt output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out3.txt 
IF ERRORLEVEL 1 GOTO err  
        
REM ࠢ�����७��
%PROGRAM% test\in4.txt output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out4.txt 
IF ERRORLEVEL 1 GOTO err  

REM �����
%PROGRAM% test\in5.txt output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out5.txt 
IF ERRORLEVEL 1 GOTO err                               
                            
REM �� ��㣮�쭨�
%PROGRAM% test\in6.txt output.txt                                 
IF ERRORLEVEL 1 GOTO err 
FC output.txt test\out6.txt 
IF ERRORLEVEL 1 GOTO err  
                     
ECHO Program testing succeeded :-)                  
EXIT                                                
:err                                                
ECHO Program testing failed :-(                     
EXIT