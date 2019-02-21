//
//  SettingsTableViewController.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit
import Auth0
import SwiftKeychainWrapper
import SimpleKeychain
import Kingfisher

class SettingsTableViewController: UITableViewController, StoryboardInstantiatable {
    
    static let storyboardName: StoryboardName = "SettingsTableViewController"
    var profile: UserInfo!
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        navigationController?.navigationBar.layer.shadowRadius = 8
        navigationController?.navigationBar.layer.shadowOpacity = 0.4
        navigationController?.view.backgroundColor = .white
        guard let profile = SessionManager.shared.profile else  {return}
        profilePictureImageView.kf.setImage(with: profile.picture)
        print(profile.picture)
       profileNameLabel.text = profileName
        
        profilePictureImageView.layer.cornerRadius = profilePictureImageView.frame.height / 2
        profilePictureImageView.layer.borderColor = UIColor.lightGray.cgColor
        profilePictureImageView.layer.borderWidth = 0.2
        profilePictureImageView.clipsToBounds = true
    }
    
    // MARK: - IBOutlets
    
    @IBOutlet weak var profilePictureImageView: UIImageView!
    @IBOutlet weak var profileNameLabel: UILabel!
    
    
    
    // MARK: - IBActions
    
    @IBAction func doneButtonPressed(_ sender: Any) {
        dismiss(animated: true, completion: nil)
        
        
        guard let accessToken = LoginViewController.accessToken() else { return }
        
        Auth0
            .authentication()
            .userInfo(withAccessToken: accessToken)
            .start { result in
                switch(result) {
                case .success(let profile):
                    // You've got the user's profile, good time to store it locally.
                // e.g. self.profile = profile
                    print(profile)
                    if let name = profile.name {
                        print(name)
                    }
                case .failure(let error):
                    // Handle the error
                    print("Error: \(error)")
                }
        }
    }
    
    @IBAction func billingPressed(_ sender: Any) {
        let billingMessage = "To change your subscription type or modify your billing details, access your ShopTrak account online."
        Popovers.triggerMessagePopover(with: billingMessage)
    }
    
    
    @IBAction func goToAppSettings(_ sender: Any) {
        // This will open ShopTrak's settings once we configure push notifications
        let settingsUrl = URL(string: UIApplication.openSettingsURLString)!
        UIApplication.shared.open(settingsUrl)
    }
    
    @IBAction func openOnlineHelp(_ sender: Any) {
        let url = URL(string: "https://labs10-shopping-list.netlify.com")!
        UIApplication.shared.open(url)
    }
    
    
    @IBAction func logoutPressed(_ sender: Any) {
       
        _ = SessionManager.shared.logout()
        
        // Yvette, put this code wherever you complete your token deletion to reset to the login screen
        // 👇🏼👇🏼👇🏼
        UI {
            defaults.set(false, forKey: Keys.isUserLoggedInKey)
            UIApplication.shared.keyWindow?.rootViewController = LoginViewController.instantiate()
        }
    }
    
}
