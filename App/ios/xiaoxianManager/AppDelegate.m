/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RCTHotUpdate.h"
#import <IQKeyboardManager/IQKeyboardManager.h>

@implementation AppDelegate




- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self configKeyboardManager];
  NSURL *jsCodeLocation;
[UIApplication sharedApplication].statusBarStyle = UIStatusBarStyleLightContent;
  // 启动图片延时: 1秒`  
  [NSThread sleepForTimeInterval:1];
  
  //if(DEBUG){
  // 原来的jsCodeLocation保留在这里
 // jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  //} else {
  // 非DEBUG情况下启用热更新
  jsCodeLocation=[RCTHotUpdate bundleURL];
    
  //}
  

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"xiaoxianManager"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

#pragma mark - Private Methods
- (void)configKeyboardManager {
  [IQKeyboardManager sharedManager].enable = YES;
  [IQKeyboardManager sharedManager].shouldShowToolbarPlaceholder = NO;
  [IQKeyboardManager sharedManager].keyboardDistanceFromTextField = 60;
}

@end
