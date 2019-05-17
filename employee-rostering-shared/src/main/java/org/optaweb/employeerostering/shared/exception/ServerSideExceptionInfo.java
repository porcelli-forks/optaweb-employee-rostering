/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.optaweb.employeerostering.shared.exception;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class ServerSideExceptionInfo {

    private String i18nKey;
    private String exceptionMessage;
    private List<String> messageParameters;
    private String exceptionClass;
    private List<String> stackTrace;
    private ServerSideExceptionInfo exceptionCause;

    // Workaround for GWT client not being able to use a
    // generated JSON Deserializer
    public enum ServerSideExceptionInfoFields {
        I18N_KEY("i18nKey"),
        EXCEPTION_MESSAGE("exceptionMessage"),
        MESSAGE_PARAMETERS("messageParameters"),
        EXCEPTION_CLASS("exceptionClass"),
        STACK_TRACE("stackTrace"),
        EXCEPTION_CAUSE("exceptionCause");

        private String fieldName;

        private ServerSideExceptionInfoFields(String fieldName) {
            this.fieldName = fieldName;
        }

        public static ServerSideExceptionInfoFields getFieldForName(String fieldName) {
            for (ServerSideExceptionInfoFields field : ServerSideExceptionInfoFields.values()) {
                if (field.fieldName.equals(fieldName)) {
                    return field;
                }
            }
            throw new IllegalArgumentException("Invalid field: \"" + fieldName + "\"");
        }
    }

    @SuppressWarnings("unused")
    public ServerSideExceptionInfo() {

    }

    public ServerSideExceptionInfo(String i18nKey, String exceptionMessage, List<String> messageParameters,
                                   String exceptionClass, List<String> stackTrace, ServerSideExceptionInfo exceptionCause) {
        this.i18nKey = i18nKey;
        this.exceptionMessage = exceptionMessage;
        this.messageParameters = messageParameters;
        this.exceptionClass = exceptionClass;
        this.stackTrace = stackTrace;
        this.exceptionCause = exceptionCause;
    }

    public ServerSideExceptionInfo(Throwable exception, String i18nKey, String... messageParameters) {
        this.i18nKey = i18nKey;
        this.exceptionMessage = exception.getMessage();
        this.exceptionClass = exception.getClass().getName();
        this.stackTrace = Arrays.stream(exception.getStackTrace())
                .map(StackTraceElement::toString).collect(Collectors.toList());
        this.messageParameters = Arrays.asList(messageParameters);
        if (exception.getCause() != null) {
            this.exceptionCause = new ServerSideExceptionInfo(exception.getCause(), "");
        } else {
            this.exceptionCause = null;
        }
    }

    public String getI18nKey() {
        return i18nKey;
    }

    public void setI18nKey(String i18nKey) {
        this.i18nKey = i18nKey;
    }

    public String getExceptionMessage() {
        return exceptionMessage;
    }

    public void setExceptionMessage(String exceptionMessage) {
        this.exceptionMessage = exceptionMessage;
    }

    public List<String> getMessageParameters() {
        return messageParameters;
    }

    public void setMessageParameters(List<String> messageParameters) {
        this.messageParameters = messageParameters;
    }

    public String getExceptionClass() {
        return exceptionClass;
    }

    public void setExceptionClass(String exceptionClass) {
        this.exceptionClass = exceptionClass;
    }

    public List<String> getStackTrace() {
        return stackTrace;
    }

    public void setStackTrace(List<String> stackTrace) {
        this.stackTrace = stackTrace;
    }

    public ServerSideExceptionInfo getExceptionCause() {
        return exceptionCause;
    }

    public void setExceptionCause(ServerSideExceptionInfo exceptionCause) {
        this.exceptionCause = exceptionCause;
    }
}