# FocusedFind

An AI-powered search assistant that enhances your search bar with context-aware suggestions for smarter, faster results.

FocusedFind is a Chrome extension that provides search suggestions based on the context of your workflow. By integrating AI-powered predictions and contextual understanding, it replaces default suggestions with highly relevant and personalized options.

## Tester Guide

- Clone the repository
- Open the unpacked extension on Google Chrome Dev with Built In AI enabled
- Create your workflow by opening websites or relevant content 
- Open **google.com** on a new tab and start your search. Note: Suggestions take between 5 to 10 seconds to load. Extension detects a search only if you navigate to google.com before beginning to search.

### Known Issues

- Failure to generate suggestions will result in unexpected suggestions
- Issues encountered when using the same browser session for more than one search
- Keywords retained across multiple searches, leading to loss of context
- Inefficient keyword extraction: presence of words irrelevent to the context leads to failure
- Issues with built in model: NotSupportedError, untested language

### Work-arounds

- In case of failure, please close the browser session, refresh the extension, reopen all relevant tabs and try again
- As far as possible, for testing avoid pages with excessive content not relevant to the search context, such as a website with a top menu bar. The current keyword extractor extracts the first 50 words of each webpage. Wikipedia pages are generally okay.
- Check console for any additional log info