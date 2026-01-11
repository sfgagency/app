#!/bin/sh

Feststellen des Programmpfads

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

Umgebungsvariablen setzen

APP_HOME=pwd
APP_BASE_NAME=basename "$0"
CLASSPATH="$APP_HOME/gradle/wrapper/gradle-wrapper.jar"
JAVACMD="java"

if [ -n "$JAVA_HOME" ] ; then
JAVACMD="$JAVA_HOME/bin/java"
fi

Gradle Wrapper ausführen

exec "$JAVACMD" -Xmx512m "-Dorg.gradle.appname=$APP_BASE_NAME" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
