type ChatbotResponseFieldValueKind =
    | 'stringValue'
    | 'boolValue'
    | 'structValue'
    | 'listValue'
    | 'nullValue'
    | 'numberValue'
    | 'errorValue'
    | 'unknownValue';

type CompositeValueType =
    | Record<
          Exclude<ChatbotResponseFieldValueKind, 'listValue' | 'structValue'>,
          unknown
      >
    | { listValue: { values: ChatbotResponseFieldValue[] } }
    | { structValue: { fields: Record<string, ChatbotResponseFieldValue> } };

type ChatbotResponseFieldValue = {
    kind: ChatbotResponseFieldValueKind;
} & CompositeValueType;

export function deserializeChatbotResponseFieldValue(
    value: ChatbotResponseFieldValue,
): unknown {
    switch (value.kind) {
        case 'stringValue':
            return value['stringValue'];
        case 'boolValue':
            return value['boolValue'];
        case 'structValue':
            return deserializeChatbotResponseStructValue(value['structValue']);
        case 'listValue':
            return value['listValue'].values.map(
                deserializeChatbotResponseFieldValue,
            );
        case 'nullValue':
            return null;
        case 'numberValue':
            return value['numberValue'];
    }
}

function deserializeChatbotResponseStructValue(value: {
    fields: Record<string, ChatbotResponseFieldValue>;
}): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, fieldValue] of Object.entries(value.fields)) {
        result[key] = deserializeChatbotResponseFieldValue(fieldValue);
    }
    return result;
}
