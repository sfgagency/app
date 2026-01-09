#!/bin/sh

################################################################################

Gradle startup script for UN*X

################################################################################

Attempt to set APP_HOME

Resolve links: $0 may be a link

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

SAVED="pwd"
cd "dirname \"$PRG\"/" >/dev/null
APP_HOME="pwd -P"
cd "$SAVED" >/dev/null

APP_NAME="Gradle"
APP_BASE_NAME=basename "$0"

Add default JVM options here.

WICHTIG: Keine extra Anführungszeichen innerhalb der Variablen!

DEFAULT_JVM_OPTS="-Xmx512m -XX:MaxMetaspaceSize=256m"

Determine the Java command to use to start the JVM.

if [ -n "$JAVA_HOME" ] ; then
JAVACMD="$JAVA_HOME/bin/java"
else
JAVACMD="java"
fi

if [ ! -x "$JAVACMD" ] ; then
which java >/dev/null 2>&1 || echo "ERROR: JAVA_HOME is not set"
fi

Collect all arguments for the java command.

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

Execute Gradle

Hier nutzen wir die Variable OHNE zusätzliche manuelle Quotes drumherum

exec "$JAVACMD" $DEFAULT_JVM_OPTS "-Dorg.gradle.appname=$APP_BASE_NAME" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
