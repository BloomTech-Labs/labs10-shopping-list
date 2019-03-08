//
//  AppDelegate.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit
import Auth0
import SimpleKeychain
import PusherSwift
import UserNotifications
import PushNotifications


let defaults = UserDefaults.standard

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    let pushNotifications = PushNotifications.shared
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        self.pushNotifications.start(instanceId: "1c17ef2c-92ea-486e-af1b-7bc8faa62607")
        self.pushNotifications.registerForRemoteNotifications()
       // try? self.pushNotifications.subscribe(interest: "add-item")

      
        let center = UNUserNotificationCenter.current()
        center.requestAuthorization(options: [.alert, .sound, .badge]) { (granted, error) in
            if (granted) {
                DispatchQueue.main.async(execute: {
                    application.registerForRemoteNotifications()
                })
            }
        }
        
        window = UIWindow()
        window?.makeKeyAndVisible()
        
        let loginVC = LoginViewController.instantiate()
        
        let mainVC = MainViewController.instantiate()
        
        
        self.window?.rootViewController = SessionManager.tokens == nil ? loginVC : mainVC
        
        return true
    }
    
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken : Data) {
        self.pushNotifications.registerDeviceToken(deviceToken)
    }
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        self.pushNotifications.handleNotification(userInfo: userInfo)
    }
    
    //Auth0 requires this function in AppDelegate
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any]) -> Bool {
        return Auth0.resumeAuth(url, options: options)
    }
}
