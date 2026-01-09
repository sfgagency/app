#!/bin/sh

Gradle startup script for UN*X

Attempt to set APP_HOME

PRG="$0"

Need this for relative symlinks.

while [ -h "$PRG" ] ; do
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

warn () {
echo "$1"
}

die () {
echo
echo "$1"
echo
exit 1
}

WICHTIG: Wir reduzieren den Speicherhunger für Bitrise

DEFAULT_JVM_OPTS='"-Xmx512m" "-XX:MaxMetaspaceSize=256m" "-XX:+UseParallelGC"'

Determine the Java command to use to start the JVM.

if [ -n "$JAVA_HOME" ] ; then
if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
JAVACMD="$JAVA_HOME/jre/sh/java"
else
JAVACMD="$JAVA_HOME/bin/java"
fi
else
JAVACMD="java"
fi

if [ ! -x "$JAVACMD" ] ; then
which java >/dev/null 2>&1 || die "ERROR: JAVA_HOME is not set and no 'java' command could be found."
fi

Collect all arguments for the java command.

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

Execute Gradle

exec "$JAVACMD" $DEFAULT_JVM_OPTS $GRADLE_OPTS "-Dorg.gradle.appname=$APP_BASE_NAME" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
