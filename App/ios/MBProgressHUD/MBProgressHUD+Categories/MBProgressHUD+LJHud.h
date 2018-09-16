//
//  MBProgressHUD+LJHud.h
//  chujing
//
//  Created by 刘杰 on 2016/11/17.
//  Copyright © 2016年 Eastnet. All rights reserved.
//

#import "MBProgressHUD.h"

@interface MBProgressHUD (LJHud)


+ (void)showSuccess:(NSString *)success;
+ (void)showSuccess:(NSString *)success toView:(UIView *)view;

+ (void)showError:(NSString *)error;
+ (void)showError:(NSString *)error toView:(UIView *)view;

+ (MBProgressHUD *)showMessage:(NSString *)message;
+ (MBProgressHUD *)showMessage:(NSString *)message toView:(UIView *)view;

+ (void)hideHUD;
+ (void)hideHUDForView:(UIView *)view;

/**
 显示提示信息，几秒后消失

 @param message 信息
 @param delay 延时事件
 @return hud
 */
+ (MBProgressHUD *)showMessage:(NSString *)message delay:(float)delay;

@end
