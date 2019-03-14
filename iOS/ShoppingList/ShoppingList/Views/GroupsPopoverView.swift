//
//  GroupsPopoverView.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/26/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit

protocol PopoverViewDelegate: class {
    func updatesNeeded()
}

class GroupsPopoverView: UIView, NibInstantiatable, UITableViewDelegate, UITableViewDataSource {
    
    static let nibName: NibName = "GroupsPopoverView"
    weak var delegate: PopoverViewDelegate?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        tableView.delegate = self
        tableView.dataSource = self
        tableView.rowHeight = 80
        tableView.backgroundColor = UIColor(named: "Background")
        tableView.separatorStyle = .none
        tableView.tableFooterView = UIView()
        tableView.register(UINib(nibName: "ItemTableViewCell", bundle: nil), forCellReuseIdentifier: "ItemCell")
        let groupsText = allGroups.count == 1 ? "\(allGroups.count) GROUP" : "\(allGroups.count) GROUPS"
        groupsLabel.text = groupsText
        
        guard let user = userObject else { return }
        
        if user.subscriptionType == 1  && allGroups.count >= 1 {
            newGroupButton.isEnabled = false
            newGroupButton.alpha = 0.5
        } else {
            newGroupButton.isEnabled = true
            newGroupButton.alpha = 1
        }
    }
    
    @IBAction func newGroupButtonPressed(_ sender: Any) {
        guard let delegate = delegate else { return }
        Popovers.triggerNewGroupPopover(delegate)
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return allGroups.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "ItemCell", for: indexPath) as? ItemTableViewCell else { return UITableViewCell() }
        cell.tintColor = UIColor(named: "Theme")
        let group = allGroups[indexPath.row]
        guard let selectedGroup = selectedGroup else { return cell }
        
        cell.itemLabel.text = group.name
        cell.accessoryType = (group == selectedGroup) ? .checkmark : .none
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        selectedGroup = allGroups[indexPath.row]
        delegate?.updatesNeeded()
        popover.dismiss()
    }
    
    func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
        
        guard let selectedGroup = selectedGroup else { return [] }
        let group = allGroups[indexPath.row]
        let index = allGroups.index(of: group) ?? 0
        
        let delete = UITableViewRowAction(style: .destructive, title: "Delete") { (action, indexPath) in
            GroupController.shared.delete(group: group, completion: { (_) in })
            allGroups.remove(at: index)
            tableView.deleteRows(at: [indexPath], with: .automatic)
        }
        
        return selectedGroup == group ? [] : [delete]
    }
    
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var groupsLabel: UILabel!
    @IBOutlet weak var newGroupButton: UIButton!
    
}
