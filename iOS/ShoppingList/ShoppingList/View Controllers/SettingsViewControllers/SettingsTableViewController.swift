//
//  SettingsTableViewController.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit
import Kingfisher
import Auth0

class SettingsTableViewController: UITableViewController, StoryboardInstantiatable {
    
    static let storyboardName: StoryboardName = "SettingsTableViewController"
    
    // MARK: - Lifecycle methods
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        setup()
        update()
    }
    
    private func update() {
        guard let user = userObject else { return }
        let profilePictureUrl = URL(string: user.profilePicture)!
        profilePictureImageView.kf.setImage(with: profilePictureUrl)
        profileNameLabel.text = user.name
    }
    
    private func setup() {
        navigationController?.navigationBar.layer.shadowRadius = 8
        navigationController?.navigationBar.layer.shadowOpacity = 0.4
        navigationController?.view.backgroundColor = .white
        
        profilePictureImageView.layer.cornerRadius = profilePictureImageView.frame.height / 2
        profilePictureImageView.layer.borderColor = UIColor.lightGray.cgColor
        profilePictureImageView.layer.borderWidth = 0.2
        profilePictureImageView.clipsToBounds = true
    }
    
    // MARK: - IBOutlets
    
    @IBOutlet weak var profilePictureImageView: UIImageView!
    @IBOutlet weak var profileNameLabel: UILabel!
    @IBOutlet weak var inviteUserLabel: UILabel!
    
    // MARK: - IBActions
    
    @IBAction func doneButtonPressed(_ sender: Any) {
        dismiss(animated: true, completion: nil)
    }
    
    @IBAction func inviteUser(_ sender: Any) {
        InviteController.shared.createInvite { (inviteCode) in
            guard let inviterCode = inviteCode?.inviteCode,
                  let selectedGroup = selectedGroup else { return }
            
            let shareText = "Join my group shopping list '\(selectedGroup.name)' on ShopTrak -> https://labs10-shopping-list.netlify.com/invite?\(inviterCode)"
            
            let activityViewController = UIActivityViewController(activityItems: [shareText], applicationActivities: nil)
            
            self.present(activityViewController, animated: true, completion: nil)
        }
    }
    
    
    @IBAction func billingPressed(_ sender: Any) {
        let billingMessage = "To change your subscription type or modify your billing details, access your ShopTrak account online."
        Popovers.triggerMessagePopover(with: billingMessage)
    }
    
    @IBAction func goToAppSettings(_ sender: Any) {
        let settingsUrl = URL(string: UIApplication.openSettingsURLString)!
        UIApplication.shared.open(settingsUrl)
    }
    
    @IBAction func openOnlineHelp(_ sender: Any) {
        let helpUrl = URL(string: "https://labs10-shopping-list.netlify.com")!
        UIApplication.shared.open(helpUrl)
    }
    
    @IBAction func logoutPressed(_ sender: Any) {
        UI {
            SessionManager.tokens = nil
            UIApplication.shared.keyWindow?.rootViewController = LoginViewController.instantiate()
        }
    }


}


