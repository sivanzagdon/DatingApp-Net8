﻿using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API;

public interface IUserRepository
{
   void Update(AppUser user);
   Task<bool> SaveAllAsync();
   Task<IEnumerable<AppUser>> GetUsersAsync();
   Task<AppUser?>GetUserByIdAsync(int id);
   Task<AppUser?> GetUserByUsernameAsync(string username);
   Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
   Task<MemberDto?>GetMemberAsync(string username);



}
