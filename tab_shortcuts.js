// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Register a callback function with the commands api, which will be called when
 * one of our registered commands is detected.
 */

const maxLength = 2;

chrome.commands.onCommand.addListener(function(command) {
    // Call 'update' with an empty properties object to get access to the current
    // tab (given to us in the callback function).
    // chrome.tabs.update({}, function(tab) {
    //   if (command == 'toggle-pin-tab')
    //     chrome.tabs.update({pinned: !tab.pinned});
    //   else if (command == 'duplicate-tab')
    //     chrome.tabs.duplicate(tab.id);
    // });

    // chrome.tabs.query({currentWindow: true}, function(tabList){
    //     const lastId = tabList[tabList.length - 1].id;
    //     chrome.tabs.update(lastId, {active: true, highlighted: true});
    // })
    chrome.storage.local.get(["selectHistory"], function(items){
        const list = items.selectHistory ? JSON.parse(items.selectHistory) : [];
        if(!list[1]){
            return;
        }
        const nextId = list[1].id;
        chrome.tabs.update(nextId, {active: true, highlighted: true});
    });
});

chrome.tabs.onHighlighted.addListener(function(highlightInfo){
    const tabId = highlightInfo.tabIds[0];
    chrome.tabs.query({currentWindow: true}, function(list){
        const nowTab = list.find(tb => tb.id === tabId);
        const item = {id: nowTab.id, title: nowTab.title};
        chrome.storage.local.get(["selectHistory"], function(items){
            let selectHistory = items.selectHistory ? JSON.parse(items.selectHistory) : [];
            console.log(selectHistory);
            selectHistory.unshift(item);
            selectHistory = selectHistory.slice(0, maxLength);
            selectHistory = JSON.stringify(selectHistory);
            chrome.storage.local.set({selectHistory});
        });
    });
});



// // Copyright 2017 The Chromium Authors. All rights reserved.
// // Use of this source code is governed by a BSD-style license that can be
// // found in the LICENSE file.
// chrome.commands.onCommand.addListener(function(command) {
//     chrome.tabs.query({currentWindow: true}, function(tabs) {
//       // Sort tabs according to their index in the window.
//       tabs.sort((a, b) => { return a.index < b.index; });
//       let activeIndex = tabs.findIndex((tab) => { return tab.active; });
//       let lastTab = tabs.length - 1;
//       let newIndex = -1;
//       if (command === 'flip-tabs-forward')
//         newIndex = activeIndex === 0 ? lastTab : activeIndex - 1;
//       else  // 'flip-tabs-backwards'
//         newIndex = activeIndex === lastTab ? 0 : activeIndex + 1;
//       chrome.tabs.update(tabs[newIndex].id, {active: true, highlighted: true});
//     });
//   });