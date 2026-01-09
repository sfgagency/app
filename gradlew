#!/bin/sh

Minimalistisches Gradlew ohne fehleranfällige Kommentare

PRG="$0"
while [ -h "$PRG" ]; do
ls=ls -ld "$PRG"
link=expr "$ls" : '.*-> \(.*\)$'
if expr "$link" : '/.*' > /dev/null; then
PRG="$link"
else
PRG=dirname "$PRG""/$link"
fi
done

APP_HOME=pwd -P
APP_BASE_NAME=basename "$0"
CLASSPATH="$APP_HOME/gradle/wrapper/gradle-wrapper.jar"
JAVACMD="java"

if [ -n "$JAVA_HOME" ] ; then
JAVACMD="$JAVA_HOME/bin/java"
fi

exec "$JAVACMD" -Xmx512m "-Dorg.gradle.appname=$APP_BASE_NAME" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
