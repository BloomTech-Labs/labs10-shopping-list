//
//  MainViewController.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit

class MainViewController: UIViewController, StoryboardInstantiatable {

    static let storyboardName: StoryboardName = "MainViewController"
    @IBOutlet weak var groupName: UIButton!
    
    var user: User?
    var selectedGroup: Group?
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()

        GroupController.shared.getGroupWith(userID: 501) { (groups) in
            if let groups = groups {
                self.user?.groups = groups
                self.selectedGroup = groups[0]
                self.updateViews()
            }
            
            let groupMemberCon = GroupMemberController()
            groupMemberCon.getGroupMembers(forGroup: self.selectedGroup!) { (group) in
                guard let group = group else { return }
                
                print("Got a group with id: \(group.groupID) and \(group.memberAmount) members. The first member's userID is: \(String(describing: group.members?.first?.userID))")
            }
        }
    }
    
    private func updateViews() {
        if let name = selectedGroup {
            groupName.setTitle(name.name, for: .normal)
        }
    }
    
    
    // MARK: - IBActions
    
    @IBAction func addNewItemButtonPressed(_ sender: Any) {
    }
    
    @IBAction func showGroupsButtonPressed(_ sender: Any) {
        Popovers.triggerGroupsPopover()
    }
    
    @IBAction func settingsButtonPressed(_ sender: Any) {
        let storyboard = UIStoryboard(name: "SettingsTableViewController", bundle: nil)
        let settingsVC = storyboard.instantiateInitialViewController() ?? SettingsTableViewController.instantiate()
        present(settingsVC, animated: true, completion: nil)
    }

}


