export function disableAutocomplete(selector: string): void {
    document.querySelectorAll(selector).forEach((e) => {
        e.setAttribute('autocomplete', 'stopDamnAutocomplete');
    });
}

export function disabledAutosuggestion(event: React.FocusEvent<HTMLElement>) {
    return event.target.setAttribute('autocomplete', 'whatever');
}
