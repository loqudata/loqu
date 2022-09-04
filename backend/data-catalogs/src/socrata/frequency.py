import structlog

from typing import Any, Union

logger = structlog.get_logger()

# Frequency detection and normalization
# possibilities: use nltk or natural language to get work roots
# currently we have it as <root>ly because just "month" for example could capture
# lots of other metadata that is not a frequency, where other heuristics might be required
# From https://resources.data.gov/schemas/dcat-us/v1.1/iso8601_guidance/
frequencies = {
    "Decennial": "R/P10Y",
    "Quadrennial": "R/P4Y",
    "Yearly": "R/P1Y",
    "Annual": "R/P1Y",
    "Bimonthly": "R/P2M or R/P0.5M",
    "Semiweekly": "R/P3.5D",
    "Daily": "R/P1D",
    "Biweekly": "R/P2W or R/P0.5W",
    "Semiannual": "R/P6M",
    "Biennial": "R/P2Y",
    "Triennial": "R/P3Y",
    "Three times a week": "R/P0.33W",
    "Three times a month": "R/P0.33M",
    "Continuous": "R/PT1S",
    "Monthly": "R/P1M",
    "Quarterly": "R/P3M",
    "Semimonthly": "R/P0.5M",
    "Three times a year": "R/P4M",
    "Weekly": "R/P1W",
    "Hourly": "R/PT1H",
    "No longer updated": "NLONGER_DS_UPDATES",
    "No updates": "NLONGER_DS_UPDATES",
    "Never": "NLONGER_DS_UPDATES",
    "Historical data": "NLONGER_DS_UPDATES",
    "Not updated": "NLONGER_DS_UPDATES",
    # We have multiple phrases that represent the same meaning.
    # Irregular is last because in the reversed dictionary it will become the label associated with I
    "Ad hoc": "IRREG_DS_UPDATES",
    "As required": "IRREG_DS_UPDATES",
    "On-Demand/As-Needed": "IRREG_DS_UPDATES",
    "Irregular": "IRREG_DS_UPDATES",
    "As needed": "IRREG_DS_UPDATES",
    # TODO: as-needed, historical, unknown

    "Static": "ONETIME_DS_UPDATES",
    "One-time": "ONETIME_DS_UPDATES",
    "One time": "ONETIME_DS_UPDATES",
    "Once": "ONETIME_DS_UPDATES",

    "Streaming": "STRM_DS_UPDATES"
    # Maybe add TBD/to be determined
}

freq_rev = {val: key for key, val in frequencies.items()}
# print(freq_rev)

# Maybe don't check the key for these freqs also
def detect_frequency(input: str) -> Union[None, str]:
    """Takes in a metadata key or value and outputs the frequency of dataset updates, if found"""
    if not isinstance(input, str):
        return
    val = input.lower()
    log = logger.bind(val=val)

    res = None
    for freq_word in frequencies:
        # freq_word = freq_word.lower()
        # also had `or val in freq_word`, but this second part is unlikely because the value is often something like:
        # "updated each quarter" where quarter is a subset of quarterly, but the rest of it isn't there so it doesn't work
        if freq_word.lower() in val:
            res = freq_rev[frequencies[freq_word]].lower()

    for freq_repr in freq_rev:
        # freq_repr = freq_repr.lower()
        if freq_repr in input:  # or val in freq_repr
            if res is not None:
                log.warning("both_word_and_repr_in_same_val")
            res = freq_rev[freq_repr].lower()
    # log.info("detect", res=res)
    return res


def get_frequency_from_metadata(metadata: dict) -> Union[None, str]:
    """Returns a normalized frequency value from a 2-level nested Socrata metadata
    dictionary that contains fieldSet keys and then field keys and values. Some Socrata APIs
    return metadata in a different format; you will have to preprocess it"""
    freq = None

    def handle_field(key: str, value: Any):
        nonlocal freq

        freq_key = detect_frequency(key)
        freq_val = detect_frequency(value)

        log = logger.bind(
            **{
                "key": key,
                "value": value,
                "freq": freq,
                "freq_key": freq_key,
                "freq_val": freq_val,
            }
        )

        if freq_key and freq_val:
            if freq_key != freq_val:
                log.warning("freq_key_val_diff")
            else:
                freq = freq_key

        if freq_key:
            freq = freq_key

        if freq_val:
            freq = freq_val

        if freq is None and "freq" in key.lower():
            freq = detect_frequency(value)
            if freq is None:
                if value == "" or value is None:
                    return
                else:
                    log.warning("exp_freq_failed_unknown", freq=freq)
                    freq = value

    # https://support.socrata.com/hc/en-us/articles/115012758487-Creating-Custom-Metadata
    # Custom metadata is broken down into fieldsets and fields.
    for fieldSet in metadata:
        for field in metadata[fieldSet]:
            handle_field(field, metadata[fieldSet][field])
            # logger.info("final_freq", freq=freq)
    return freq
