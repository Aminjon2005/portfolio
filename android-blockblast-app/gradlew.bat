@ECHO OFF

set DIR=%~dp0
set APP_BASE_NAME=%~n0
set APP_HOME=%DIR%

set DEFAULT_JVM_OPTS="-Xmx64m -Xms64m"

set CLASSPATH=%APP_HOME%\gradle\wrapper\gradle-wrapper.jar

set JAVACMD=java

"%JAVACMD%" -classpath "%CLASSPATH%" -Dorg.gradle.appname="%APP_BASE_NAME%" -Dorg.gradle.wrapper.properties="gradle/wrapper/gradle-wrapper.properties" org.gradle.wrapper.GradleWrapperMain %*
